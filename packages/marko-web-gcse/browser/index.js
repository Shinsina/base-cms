const SimpleSearchBox = () => import(/* webpackChunkName: "gcse-simple-search-box" */ './simple-search-box.vue');

export default (Browser) => {
  Browser.registerComponent('GCSESimpleSearchBox', SimpleSearchBox);
};
