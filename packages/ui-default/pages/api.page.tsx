/* eslint-disable react/function-component-definition */
import { NamedPage } from 'vj/misc/Page';
import request from 'vj/utils/request';
import React from 'react';
import ReactDOM from 'react-dom/client';

const Logo = () => <span>Hydro API Console </span>;
const defaultQuery = `\
query {
  user(id: 1) {
    uname
  }
}`;

const page = new NamedPage('api', async () => {
  const [{ default: GraphiQL }, { buildSchema }, res] = await Promise.all([
    import('graphiql'),
    import('graphql'),
    request.get('/api?schema'),
    import('graphiql/graphiql.css'),
  ]);
  // @ts-ignore
  GraphiQL.Logo = Logo;
  const App = () => (
    <GraphiQL
      schema={buildSchema(res.schema)}
      defaultQuery={defaultQuery}
      fetcher={async (graphQLParams) => {
        const data = await fetch(
          '',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(graphQLParams),
            credentials: 'same-origin',
          },
        );
        return data.json().catch(() => data.text());
      }}
    />
  );

  ReactDOM.createRoot(document.getElementById('graphiql')).render(<App />);
});

export default page;
