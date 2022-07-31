const video = document.querySelector("video")
const textElem = document.querySelector("[data-text]")

document.getElementById("btn_start_scan").addEventListener("click", () => setup());


async function setup() {
  var select = document.getElementById('language');
  let language = select.options[select.selectedIndex].value;
  console.log(language); 

  const settings = {
    video: true
  }
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    settings.video = {
      facingMode: 'environment'
    }
  }
  console.log(settings);
  const stream = await navigator.mediaDevices.getUserMedia(settings);

  video.srcObject = stream;

  video.addEventListener("playing", async () => {
    const worker = Tesseract.createWorker()
    await worker.load()
    await worker.loadLanguage(language)
    await worker.initialize(language)

    const canvas = document.createElement("canvas")
    canvas.width = video.width
    canvas.height = video.height

    document.addEventListener("keypress", async e => {
      console.log("key press");
      if (e.code !== "Space") return
      canvas.getContext("2d").drawImage(video, 0, 0, video.width, video.height)
      const {
        data: { text },
      } = await worker.recognize(canvas)

      speechSynthesis.speak(
        new SpeechSynthesisUtterance(text.replace(/\s/g, " "))
      )

      textElem.textContent = text
    })
  })
}

