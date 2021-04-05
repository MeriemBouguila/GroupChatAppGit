module.exports = {
    entry: __dirname + '/client/src/index.jsx',
    module: {
      rules: [
        {
          test: [/\.jsx$/],
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env']
            }
          }
        }
      ],
    },
    devServer: {
      historyApiFallback: true,
    },
     output: {
      filename: 'bundle.js',
      path: __dirname + '/client/dist'
    },
    
  };