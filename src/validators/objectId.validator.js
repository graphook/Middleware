const objectIdRegex = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
export default function(id) {
  return objectIdRegex.test(id);
}
