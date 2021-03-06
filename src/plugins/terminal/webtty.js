export const protocols = ["webtty"];

export const msgInputUnknown = "0";
export const msgInput = "1";
export const msgPing = "2";
export const msgResizeTerminal = "3";

export const msgUnknownOutput = "0";
export const msgOutput = "1";
export const msgPong = "2";
export const msgSetWindowTitle = "3";
export const msgSetPreferences = "4";
export const msgSetReconnect = "5";

export class WebTTY {
  constructor(
    term,
    connectionFactory,
    args,
    authToken,
    { onError, onReceive, onClose, onOpen } = {}
  ) {
    this.term = term;
    this.connectionFactory = connectionFactory;
    this.args = args;
    this.authToken = authToken;
    this.reconnect = -1;
    this.onOpen = onOpen;
    this.onReceive = onReceive;
    this.onClose = onClose;
    this.onError = onError;
  }

  open() {
    let connection = this.connectionFactory.create();
    this.connection = connection;
    let pingTimer;
    let reconnectTimeout;
    const setup = () => {
      connection.onOpen(() => {
        this.onOpen && this.onOpen();

        const termInfo = this.term.info();
        connection.send(
          JSON.stringify({
            Arguments: this.args,
            AuthToken: this.authToken,
          })
        );

        const resizeHandler = (colmuns, rows) => {
          connection.send(
            msgResizeTerminal +
              JSON.stringify({
                columns: colmuns,
                rows: rows,
              })
          );
        };

        this.term.onResize(resizeHandler);
        resizeHandler(termInfo.columns, termInfo.rows);

        this.term.onInput((input) => {
          connection.send(msgInput + input);
        });

        pingTimer = setInterval(() => {
          connection.send(msgPing);
        }, 30 * 1000);
      });

      connection.onReceive((data) => {
        const payload = data.slice(1);

        this.onReceive && this.onReceive(payload);
        switch (data[0]) {
          case msgOutput:
            this.term.output(atob(payload));
            break;
          case msgPong:
            break;
          case msgSetWindowTitle:
            this.term.setWindowTitle(payload);
            break;
          case msgSetPreferences:
            const preferences = JSON.parse(payload);
            this.term.setPreferences(preferences);
            break;
          case msgSetReconnect:
            const autoReconnect = JSON.parse(payload);
            console.log("Enabling reconnect: " + autoReconnect + " seconds");
            this.reconnect = autoReconnect;
            break;
        }
      });

      connection.onClose(() => {
        this.onClose && this.onClose();

        clearInterval(pingTimer);
        this.term.deactivate();
        if (this.reconnect > 0) {
          reconnectTimeout = setTimeout(() => {
            connection = this.connectionFactory.create();
            this.connection = connection;
            this.term.reset();
            setup();
          }, this.reconnect * 1000);
        }
      });

      connection.onError(() => {
        this.onError && this.onError();
      });

      connection.open();
    };

    setup();
    return () => {
      clearTimeout(reconnectTimeout);
      connection.close();
    };
  }

  input(input) {
    this.connection.send(msgInput + input);
  }
}
