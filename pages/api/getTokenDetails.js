// http://localhost:3000/api/getTokenDetails?address=0x30B5E345C79255101B8af22a19805A6fb96DdEBb

import DummyLogo from '../../assets/dummyToken.svg'

export default async function handler(req, res) {
  try {
    const { address } = req.query;

    if (!address) {
      res.status(400).json({ error: "Address is required" });
      return;
    }

    let response = await fetch(`https://api.coingecko.com/api/v3/coins/bsc/contract/${address}`);
    if (!response.ok) {
      // console.log(response);
        response = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`);
        if (!response.ok) {
          throw new Error("Token not found");
        }
    }

    const data = await response.json();

    const result = {
      logo: data.image?.large || DummyLogo.src,
      discord: data.links?.chat_url?.find(url => url.includes("discord")) || null,
      twitter: data.links?.twitter_screen_name || null,
      website: data.links?.homepage?.[0] || null,
    };
    // console.log(result);

    res.status(200).json(result);
  } catch (error) {
    // console.log(DummyLogo.src);
    res.status(200).json({ 
      logo: DummyLogo.src,
      discord: null,
      twitter: null,
      website: null,
     });
  }
}
