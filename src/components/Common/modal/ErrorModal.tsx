type ErrorModalProps = {
  message: string;
  onClose: () => void;
};

export function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-w-[600px] w-full bg-white rounded-xl shadow-1 px-6 py-10 sm:py-12 lg:py-14">
        <div className="text-center">
          <h2 className="font-bold text-red-500 text-3xl lg:text-[36px] mb-4">
            Ocurrió un error
          </h2>

          <p className="max-w-[480px] w-full mx-auto mb-7 text-gray-600">
            {message}
          </p>

          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
