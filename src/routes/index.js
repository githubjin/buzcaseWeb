import App from '../App';

const routes = {
  path: "/",
  component: App,
  getIndexRoute(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, {
        component: require('../component/HomePage'),
      })
    })
  },
  childRoutes: [
    {
      path: 'add',
      getComponent(location, callback) {
        require.ensure([], function(require) {
          callback(null, require('../component/AddPage'));
        })
      }
    }
  ],
};

export default routes;
