import toast from 'react-hot-toast';

// دالة لعرض رسالة نجاح
export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 4000,
    position: 'top-right',
  });
};

// دالة لعرض رسالة خطأ
export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
  });
};

// دالة لعرض رسالة تحميل
export const showLoadingToast = (message) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

// دالة لإيقاف رسالة التحميل وعرض رسالة نجاح
export const dismissLoadingToast = (toastId, successMessage) => {
  toast.dismiss(toastId);
  showSuccessToast(successMessage);
};

// دالة لإيقاف رسالة التحميل وعرض رسالة خطأ
export const dismissLoadingToastWithError = (toastId, errorMessage) => {
  toast.dismiss(toastId);
  showErrorToast(errorMessage);
}; 