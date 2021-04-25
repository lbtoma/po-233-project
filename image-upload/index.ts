import { readdirSync, rmSync } from "fs";
import { storage, initializeApp } from "firebase-admin";

initializeApp({projectId: "skin-color-ml"});

const bucket = storage().bucket("skin-color-ml.appspot.com");
const path = "images/";
const batchSize = 10;

const allFiles = readdirSync(path).filter(filename => filename.endsWith(".png"));
const total = allFiles.length;

function* getFileBatch() {
  let offset = 0;
  let limit = 0;

  do {
    limit += batchSize;
    yield allFiles.slice(offset, limit);
    offset += batchSize;
  } while (!!allFiles[limit]);
}

const uploadAll = async (): Promise<void> => {
  let progress = 0;
  console.info("Uploading images");

  for (const files of getFileBatch()) {
    console.info(`Uploaded ${progress} of ${total}`);

    await Promise.all(files.map(async (file) => {
      const filePath = `${path}${file}`;
      try {
        await bucket.upload(filePath, {destination: filePath});
        rmSync(filePath); 
      } catch(err) {
        console.error(err);
      }
    }));

    progress += batchSize;
  }

  console.info("Done.");
};

uploadAll();
