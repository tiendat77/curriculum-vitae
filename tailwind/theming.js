const _ = require('lodash');

const chroma = require('chroma-js');
const plugin = require('tailwindcss/plugin');

const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette').default;


// -----------------------------------------------------------------------------------------------------
// @ Utilities
// -----------------------------------------------------------------------------------------------------

/**
 * Normalizes the provided theme by omitting empty values and values that
 * start with "on" from each palette. Also sets the correct DEFAULT value
 * of each palette.
 *
 * @param theme
 */
const normalizeTheme = (theme) => {
  return _.fromPairs(
    _.map(
      _.omitBy(
        theme,
        (palette, paletteName) =>
          paletteName.startsWith('on') || _.isEmpty(palette)
      ),
      (palette, paletteName) => [
        paletteName,
        {
          ...palette,
          DEFAULT: palette['DEFAULT'] || palette[500],
        },
      ]
    )
  );
};

/**
 * Generates contrasting counterparts of the given palette.
 * The provided palette must be in the same format with
 * default Tailwind color palettes.
 *
 * @param palette
 * @private
 */
const generateContrasts = (palette) => {
  const lightColor = '#FFFFFF';
  let darkColor = '#FFFFFF';

  // Iterate through the palette to find the darkest color
  _.forEach(palette, (color) => {
    darkColor =
      chroma.contrast(color, '#FFFFFF') > chroma.contrast(darkColor, '#FFFFFF')
        ? color
        : darkColor;
  });

  // Generate the contrasting colors
  return _.fromPairs(
    _.map(palette, (color, hue) => [
      hue,
      chroma.contrast(color, darkColor) > chroma.contrast(color, lightColor)
        ? darkColor
        : lightColor,
    ])
  );
};

// -----------------------------------------------------------------------------------------------------
// @ TailwindCSS Main Plugin
// -----------------------------------------------------------------------------------------------------

const theming = plugin.withOptions(
  (options) => ({ addComponents, e }) => {
    addComponents({
      ':root': _.fromPairs(
        _.flatten(
          _.map(
            flattenColorPalette(
              _.fromPairs(
                _.flatten(
                  _.map(
                    normalizeTheme(options.theme),
                    (palette, paletteName) => [
                      [e(paletteName), palette],
                      [
                        `on-${e(paletteName)}`,
                        _.fromPairs(
                          _.map(
                            generateContrasts(palette),
                            (color, hue) => [
                              hue,
                              _.get(options.theme, [`on-${paletteName}`, hue]) ||
                                color,
                            ]
                          )
                        )
                      ]
                    ]
                  )
                )
              )
            ),
            (value, key) => [
              [`--${e(key)}`, value],
              [`--${e(key)}-rgb`, chroma(value).rgb().join(',')],
            ]
          )
        )
      )
    });
  },
  (options) => {
    return {
      theme: {
        extend: {
          /**
           * Add 'Primary', 'Accent' and 'Warn' palettes as colors so all color utilities
           * are generated for them; "bg-primary", "text-on-primary", "bg-accent-600" etc.
           * This will also allow using arbitrary values with them such as opacity and such.
           */
          colors: _.fromPairs(
            _.flatten(
              _.map(
                _.keys(
                  flattenColorPalette(normalizeTheme(options.theme))
                ),
                (name) => [
                  [name, `rgba(var(--${name}-rgb), <alpha-value>)`],
                  [`on-${name}`, `rgba(var(--on-${name}-rgb), <alpha-value>)`],
                ]
              )
            )
          )
        }
      }
    };
  }
);

module.exports = theming;
