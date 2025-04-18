export default function NotFoundSpin() {
  return (
    <div className="relative">
      <img
        src="/assets/images/eye-spin-left.png"
        className="absolute top-[40px] left-[64px] animate-spin w-8"
      />
      <img
        src="/assets/images/eye-spin-right.png"
        alt=""
        className="absolute top-[35px] right-[110px] animate-spin w-8"
      />
      <img
        src="/assets/images/notfound-people.png"
        alt=""
        className="w-64 h-64"
      />
    </div>
  );
}
