const { useMemo } = require("react");

function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

const useForkRef = (...refs) => {
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }
    return (refValue) => {
      refs.forEach((ref) => setRef(ref, refValue));
    };
  }, [refs]);
};

export { useForkRef };
