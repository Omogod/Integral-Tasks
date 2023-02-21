//a

for (let i = 0; i < 10; i++) {
    let row = "";
    for (let j = 0; j < 10; j++) {
      row += "*";
    }
    console.log(row);
  }

  //b
  for (let i = 1; i <= 10; i++) {
    let row = "";
    for (let j = 1; j <= i; j++) {
      row += "*";
    }
    console.log(row);
  }

  //c

  for (let i = 10; i >= 1; i--) {
    let row = "";
    for (let j = 1; j <= i; j++) {
      row += "*";
    }
    console.log(row);
  }

