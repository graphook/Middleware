
export default function(errors) {
  if (Object.keys(errors).length > 0) {
    throw errors;
  }
}
