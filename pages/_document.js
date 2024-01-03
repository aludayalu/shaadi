import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { CssBaseline } from '@nextui-org/react';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: React.Children.toArray([initialProps.styles])
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>{CssBaseline.flush()}
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet"/>
        </Head>
        <meta name="viewport" content="width=device-width, initial-scale=0.6, maximum-scale=0.6,minimum-scale=0.6"/>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

