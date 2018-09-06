export default () => (
  <div className="my-16">
    {true ? (
      <div className="text-center">
        <div className="flex items-center text-grey">
          Logged in as Jesús Ferretti
        </div>
        <a href="#" className="block text-black mt-2">
          Logout
        </a>
      </div>
    ) : (
      <div className="flex justify-center">
        <form className="w-1/3">
          <input
            className="block w-full bg-grey-lighter p-4 rounded mb-4"
            placeholder="Type your Twitter username."
          />
          <button
            className="bg-black text-white p-4 rounded font-bold block w-full uppercase text-sm"
            type="submit"
          >
            Let's chat!
          </button>
        </form>
      </div>
    )}
  </div>
);
