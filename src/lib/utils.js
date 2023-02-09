export const formatCompactNumber = function (number) {
  const formatter = Intl.NumberFormat("en", { notation: "compact" });
  return formatter.format(Number(number));
}

export const setUrl = (param,value) => {
  const url = new URL(window.location.href);
  const search_params = url.searchParams;

  // new value of "id" is set to "101"
  search_params.set(param, value);

  // change the search property of the main url
  url.search = search_params.toString();
  window.history.pushState("", "", url.search);
}