/**
 * @author thenrerise@gmail.com (Hamit Zor)
 */

module.exports = {
  presets: [
    [
      "@babel/env",
      {
        "useBuiltIns": "entry",
        "corejs": 3,
        "targets": {
          "node": 11
        }
      }
    ]
  ],
  plugins: [
    "@babel/proposal-class-properties"
  ]
}