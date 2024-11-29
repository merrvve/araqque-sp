
import officeParser from 'officeparser'



export async function extractText(buffer: Buffer) : Promise<string> {
    return officeParser.parseOfficeAsync(buffer);
    
    
}



