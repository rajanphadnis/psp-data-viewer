import { Firestore, doc, getDoc, getDocFromCache } from "firebase/firestore";
import type { AllTests } from "./types";
var AWS = require("aws-sdk/dist/aws-sdk-react-native");
// import AWS from "aws-sdk";
// import { TimestreamQueryClient, QueryCommand } from "@aws-sdk/client-timestream-query";
// import { fromCognitoIdentity, fromCognitoIdentityPool, fromTemporaryCredentials} from "@aws-sdk/credential-providers";

AWS.config.update({
  region: "us-east-2",
  credentials: { accessKeyId: "", secretAccessKey: "" },
  // new AWS.CognitoIdentityCredentials({ IdentityPoolId: "us-east-2:a5f0e7fd-cf03-427b-ad78-fbece90bc2bc" }),
});

export async function getSensorData(dataset: string, fromCache: boolean, startTimestamp: number | undefined = undefined, endTimestamp: number | undefined = undefined): Promise<[number[], number[], string]> {
  var timestreamquery = new AWS.TimestreamQuery();
  const input = {
    QueryString: `
    WITH RankedData AS (
      SELECT time,fms__lbf__,
         ROW_NUMBER() OVER (ORDER BY time) AS RowNum
      FROM "sampleDB"."whoopsie"
    )
    SELECT time,fms__lbf__
    FROM RankedData
    WHERE RowNum % 200 = 0
    ORDER BY time ASC LIMIT 500000
    `,
    // MaxRows: Number(1500),
  };

  var thing = await timestreamquery.query(input).promise();
  let times: number[] = [];
  let datas: number[] = [];
  if (thing.$response.error) {
    console.error(thing.$response.error);
    return [[0], [0], "fail"];
  } else {
    thing.Rows.forEach((row: any) => {
      times.push(new Date(row.Data[0].ScalarValue!).getTime() / 1000);
      datas.push(parseFloat(row.Data[1].ScalarValue!));
    });
    console.log(times);
    console.log(datas);
    return [times, datas, "lbf"];
  }

  // const docRef = doc(db, test_id, dataset);
  // let docSnap;
  // if (fromCache) {
  //   try {
  //     docSnap = await getDocFromCache(docRef);
  //   } catch (e) {
  //     console.log("cache miss:", e);
  //     docSnap = await getDoc(docRef);
  //   }
  // } else {
  //   docSnap = await getDoc(docRef);
  // }
  // const docData = docSnap.data()!;
  // const time: number[] = docData["time"];
  // const data: number[] = docData["data"];
  // const scale: string = docData["unit"];
  // activeDatasets.cached.push(dataset);
  // return [time, data, scale];
}

export async function getTestInfo(): Promise<[string[], string, string, string, number]> {
  const docRef = doc(db, test_id, "general");
  let docSnap;
  try {
    docSnap = await getDocFromCache(docRef);
  } catch (e) {
    console.log("cache miss:", e);
    docSnap = await getDoc(docRef);
  }
  const docData = docSnap.data()!;
  const datasets: string[] = docData["datasets"];
  const name: string = docData["name"];
  const test_article: string = docData["test_article"];
  const gse_article: string = docData["gse_article"];
  const initial_timestamp: number = docData["initial_timestamp"];
  return [datasets, name, test_article, gse_article, initial_timestamp];
}

export async function getGeneralTestInfo(): Promise<[AllTests[], string]> {
  const docRef = doc(db, "general", "tests");
  let docSnap = await getDoc(docRef);
  const docData = docSnap.data()!;
  const tests_unsorted: AllTests[] = docData["visible"];
  const tests = tests_unsorted.sort((a, b) => (a.initial_timestamp > b.initial_timestamp ? -1 : 1));
  const default_url: string = docData["default"];
  return [tests, default_url];
}
