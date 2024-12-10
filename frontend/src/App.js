
function App() {
  return (
    <div className="bg-dark-bg h-screen overflow-hidden">
      <div className="h-full w-full flex flex-col justify-center items-center">
        <img src="/logo.svg" className="w-72 fill-black" alt="logo"></img>
        <p className="text-4xl text-dark-text">
          Welcome to <span className="text-secondaryDark-text">RiddleX</span>
        </p>
        <p className="text-3xl text-dark-text">Comming soon..!!</p>
        <p className="text-gray-400 mt-2">@ 2024 <a href="https://iamabhi.tech/" target="__blank" className="">Abhishek Kumar</a></p>
      </div>
    </div>
  );
}

export default App;