import Elysia from "elysia";

export const trackingVisitors = new Elysia()
    .get("/check-visitor", async ({ request }) => {
        try {
                const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
                const userAgent = request.headers.get('user-agent') || ''; // capture browser or device info
                const referer = request.headers.get('referer') || ''; // captures the previous URL that led the user to your page.
                const refererDomain = referer.split('/').slice(2).join('/');

                const testIp2 = "196.249.93.101";
                const testIp = "185.252.220.151"

                // // free and no sign no setting ip no api key up but no region 
                // const res = await fetch(`https://ipapi.co/json/`);
                // console.log(res)
                // const data = await res.json();
                // console.log("Data: ", data);

                // // ? ip -geo most free-tier accurate api go to https://ipgeolocation.io
                // const ipApi = "19d9d86130224c369009ae54213dc479";

                // const res2 = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${ipApi}&ip=${testIp}`, { verbose: true });

                // const data2 = await res2.json();

                // console.log("Data2: ", data2)

                // // iphub key
                // const ipHubApi = "Mjg1NTA6U1RCY0Y3V1RRQVpjdVBQQmdSYXg0NXhjcTZqV1Y5bnQ=";

                // const res3 = await fetch("http://v2.api.iphub.info/ip/196.249.93.101")

                // proxycheck, it checks vpn, country and city of ip address and free no sign up no key but 1000 req/day but pricing is good.
                // ? use this and warn user with message "Matumizi ya VPN hayahujisiwi kwa ajili ya usalama wetu"
                // it looks vpn proxy and tor (block all)

                // ! store login time and logout time for best tracking ...

                const res4 = await fetch(`https://proxycheck.io/v2/${testIp}?vpn=1&asn=1`);

                const data4 = await res4.json();
                console.log("Data4: ", data4);


                return {
                    success: true,
                    ip,
                    userAgent,
                    referer,
                    refererDomain,
                    date: new Date(Date.now())
                }

        } catch (error) {
            return {
                success: false,
                message: error instanceof Error 
                        ? error.message 
                        : "Hitilafu kwenye seva"
            }
        }
    })