import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { lib } from "libapps";

export class Xterm {
  constructor(elem) {
    this.elem = elem;
    this.term = new Terminal();

    this.term.open(elem, true);

    const fitAddon = new FitAddon();
    this.term.loadAddon(fitAddon);
    fitAddon.fit();

    this.decoder = new lib.UTF8Decoder();

    this.fitResize = () => {
      fitAddon.fit();
      this.term.scrollToBottom();
    };
    window.addEventListener("resize", () => {
      this.fitResize();
    });
  }

  info() {
    return { columns: this.term.cols, rows: this.term.rows };
  }

  output(data) {
    this.term.write(this.decoder.decode(data));
  }

  focus() {
    this.term.focus();
  }

  setWindowTitle() {
    // document.title = title;
  }

  setPreferences() {}

  onInput(callback) {
    this.term.onData((data) => {
      callback(data);
    });
  }

  onResize(callback) {
    this.term.onResize((data) => {
      callback(data.cols, data.rows);
    });
  }

  deactivate() {
    this.term.blur();
  }

  reset() {
    this.term.clear();
  }

  close() {
    window.removeEventListener("resize", this.fitResize);
    this.term.dispose();
  }
}
