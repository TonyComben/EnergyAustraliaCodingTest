export default function handler(req, res) {
  if (req.method === "GET") {
    fetch("https://eacp.energyaustralia.com.au/codingtest/api/v1/festivals", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
