const url = "https://api.spacexdata.com/v3/launches";
export const getLaunches = async (limit, offset) => {
  return await fetch(`${url}?limit=${limit}&offset=${offset}`);
};
