module.exports = {
  presets: [
    ['@babel/preset-env', 
    {
      targets: {
        node: 'current',
      },
      useBuiltIns: 'entry',
      corejs: "2"
    }],
  ],
  plugins: [
    "@babel/plugin-proposal-class-properties"
  ]
}