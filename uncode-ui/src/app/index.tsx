import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { HomePage } from './pages/HomePage/Loadable';
import { DesignPage } from './pages/DesignPage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import TauriShortcuts from '../tauri-shortcuts';

export function App() {
  TauriShortcuts.init();
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>

      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/design" component={DesignPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
