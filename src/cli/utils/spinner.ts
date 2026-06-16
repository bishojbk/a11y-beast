const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export class Spinner {
  private interval: ReturnType<typeof setInterval> | null = null;
  private frameIdx = 0;
  private text = "";

  start(text: string) {
    this.text = text;
    this.frameIdx = 0;
    this.render();
    this.interval = setInterval(() => this.render(), 80);
  }

  update(text: string) {
    this.text = text;
  }

  stop(finalText?: string) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    process.stderr.write(`\r\x1b[K`);
    if (finalText) {
      process.stderr.write(`${finalText}\n`);
    }
  }

  private render() {
    const frame = FRAMES[this.frameIdx % FRAMES.length];
    process.stderr.write(`\r\x1b[K\x1b[36m${frame}\x1b[0m ${this.text}`);
    this.frameIdx++;
  }
}
