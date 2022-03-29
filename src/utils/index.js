export const msToTime = (duration, format) => {
  let milliseconds = Math.floor((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  switch (format) {
    case "ms":
      return minutes + ":" + seconds;
    case "hms":
      return hours + ":" + minutes + ":" + seconds;
    case "hmsm":
    default:
      return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }
};

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
