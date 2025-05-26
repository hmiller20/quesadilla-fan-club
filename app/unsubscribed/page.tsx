export default function UnsubscribedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">You've been unsubscribed</h1>
        <p className="text-gray-700 mb-6">
          You have been removed from the Quesadilla Fan Club mailing list.<br />
        </p>
        <p className="text-gray-500 text-sm">
          If this was a mistake, you can <a href="/" className="text-blue-600 underline">resubscribe</a> at any time.
        </p>
      </div>
    </div>
  );
}
