import Button from "../components/Button";

export default function Showcase() {
  return (
    <>
      <div className="p-14">
        <p className="text-lg text-purple-600">Notebuk</p>

        <div className="flex gap-2">
          <Button variant={"default"}>Testing</Button>
          <Button variant={"destructive"}>Testing</Button>
          <Button variant={"outline-primary"}>Testing</Button>
          <Button variant={"outline-black"}>Testing</Button>
          <Button variant={"secondary"}>Testing</Button>
        </div>

        <br />

        <div className="flex gap-2">
          <Button variant={"default"} styleMode="sketch">
            Testing
          </Button>
          <Button variant={"destructive"} styleMode="sketch">
            Testing
          </Button>
          <Button variant={"outline-black"} styleMode="sketch">
            Testing
          </Button>
          <Button variant={"outline-primary"} styleMode="sketch">
            Testing
          </Button>
          <Button variant={"secondary"} styleMode="sketch">
            Testing
          </Button>
        </div>
      </div>
    </>
  );
}
