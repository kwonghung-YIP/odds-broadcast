import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request:NextRequest):Promise<NextResponse> => {
    //request.socket.ser
    //console.log(response)
    //response.socket.
    return NextResponse.json("{msg:'HeHe!'}")
    //NextResponse.
}