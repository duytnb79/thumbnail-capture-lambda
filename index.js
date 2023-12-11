require("dotenv").config();

const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer");
// const { addExtra } = require("puppeteer-extra");
// const puppeteerExtra = addExtra(chromium.puppeteer);
// const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
// puppeteerExtra.use(AdblockerPlugin());

const lambdaHandler = async (
  event = { url: "https://www.kostak.co" },
  context
) => {
  const executablePath = await chromium.executablePath;
  console.log(`executable path: ${executablePath}`);
  const viewportWidth = 1440,
    viewportHeight = 900;
  try {
    chromium.args.push("--disable-gpu");
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: viewportWidth, height: viewportHeight },
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    console.log(event.url);
    await page.goto(event.url, {
      waitUntil: ["networkidle2"],
      timeout: 20000,
    });

    const res = await page.screenshot();
    console.log("res", res);
    await page.close();
    await browser.close();
    // s3Url = await uploadFileToS3(path, s3Path);
  } catch (error) {
    console.log("launch failed");
    console.log(error.message);
    console.log("error", error);
    throw error;
  }
  return "res";
};

// docker build -f Dockerfile -t capture .
// docker run --platform linux/amd64 -p 9000:8080 capture
// curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{ "url": "https://www.t-fal.co.jp/about-t-fal/" }'

// docker build -f Dockerfile.v2 -t capture-v2 .
// docker run --platform linux/amd64 -p 9000:8080 capture
// curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{ "url": "https://www.t-fal.co.jp/about-t-fal/" }'

module.exports.lambdaHandler = lambdaHandler;
