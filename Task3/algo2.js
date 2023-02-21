function getSmallestInteger(arr) {
    let smallestInteger = arr[0];
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < smallest) {
        smallestInteger = arr[i];
      }
    }
    return smallestInteger;
  }