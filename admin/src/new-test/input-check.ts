export function checkInput(
  inputtedID: string,
  inputtedName: string,
  inputtedGSEElement: string,
  inputtedTestElement: string,
  inputtedDelay: number
): boolean {
  if (inputtedName.replace(/\s/g, "") == "") {
    const error_message = `Missing Test Name. Please add a name.`;
    alert(error_message);
    console.error(error_message);
    return false;
  }
  if (inputtedDelay == null || inputtedDelay.toString() == "NaN") {
    const error_message = `Missing input delay. Please set to zero if you don't know or don't have a known TDMS delay`;
    alert(error_message);
    console.error(error_message);
    return false;
  }
  return true;
}

export async function checkFileName(target: HTMLInputElement): Promise<boolean> {
  const link = target.value;
  const fileExtension = link.split(".").pop();
  if (fileExtension == "tdms") {
    const fileName = link.split(/(\\|\/)/g).pop()!;
    let regex = /DataLog_\d\d\d\d-\d\d\d\d-\d\d\d\d-\d\d_[A-Za-z0-9_ \-]+\.tdms/i;
    const match = regex.test(fileName);
    if (!match) {
      const error_message = `TDMS file name must be exactly of the form: DataLog_YYYY-MMDD-HHMM-SS_{any letters, number, underscores, spaces, or dashes}.tdms\n\nGot: "${fileName}"`;
      alert(error_message);
      console.error(error_message);
    }
    return match;
  } else if (fileExtension == "csv") {
    const file = target.files![0];
    if (file) {
      let myPromise = new Promise<boolean>(async (resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const content = e.target!.result!.toString().split("\n").slice(0, 3);
          let lines = [];
          for (let i = 0; i < content.length; i++) {
            const element = content[i];
            lines.push(element.replace(/(\r\n|\n|\r)/gm, ""));
          }
          console.log(lines);
          const line0 = checkCSVHeader(lines[0]);
          if (line0) {
            const line1 = checkCSVLine(lines[1]);
            if (line1) {
              const line2 = checkCSVLine(lines[2]);
              if (line2) {
                console.log("file check complete");
                resolve(true);
              } else {
                resolve(false);
              }
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        };
        reader.readAsText(file);
        // await delay(5000);
        // console.log("timed out");
        // resolve(false);
      });
      const result = await myPromise;
      return result;
    } else {
      return false;
    }
  } else if (fileExtension == "hdf5") {
    return true;
  } else {
    return false;
  }
}

function checkCSVHeader(line: string) {
  const entries = line.split(",");
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (i % 2 == 0) {
      const match = entry.slice(-5) == "_time";
      if (!match) {
        const error_message = `Missing _time header in header column ${
          i + 1
        }\n\nGot: "${entry}"\nExpected: something that ends in "_time"`;
        alert(error_message);
        console.error(error_message);
        return match;
      }
    } else {
      const match = entry.slice(-5) == "_time";
      if (match) {
        const error_message = `_time header is in the wrong column (Currently in column ${
          i + 1
        })\n\nGot: "${entry}"\nExpected: something that doesn't end in "_time"`;
        alert(error_message);
        console.error(error_message);
        return match;
      }
    }
  }
  return true;
}

function checkCSVLine(line: string) {
  const entries = line.split(",");
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (i % 2 == 0) {
      let regex = /\d\d\d\d-\d\d-\d\d\s\d\d:\d\d:\d\d\.\d\d\d\d\d\d/i;
      const match = regex.test(entry);
      if (!match) {
        const error_message = `Date format must be: YYYY-MM-DD HH:MM:SS.mmmmmm\n\nGot: "${entry}"`;
        alert(error_message);
        console.error(error_message);
        return match;
      }
    } else {
      let regex = /^([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[Ee]([+-]?\d+))?$/i;
      const match = regex.test(entry);
      if (!match) {
        const error_message = `Data must be a number\n\nGot: "${entry}"\nExpected: number`;
        alert(error_message);
        console.error(error_message);
        return match;
      }
    }
  }
  return true;
}
