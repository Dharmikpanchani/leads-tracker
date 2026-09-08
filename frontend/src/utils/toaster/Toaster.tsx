import toast from 'react-hot-toast';

export interface ToastMessage {
  title: string;
  body: string;
}

export const toasterSuccess = (msg: string) => {
  if (msg) {
    toast.success(msg);
  }
};

export const toasterError = (msg: string) => {
  if (msg) {
    toast.error(msg);
  }
};

export const toasterInfo = (msg: ToastMessage | string) => {
  if (typeof msg === 'string') {
    toast(msg);
  } else {
    toast(() => (
      <span>
        <p>
          <b>{msg.title}</b>
        </p>
        <p>{msg.body}</p>
      </span>
    ));
  }
};

export default { toasterSuccess, toasterError, toasterInfo };
