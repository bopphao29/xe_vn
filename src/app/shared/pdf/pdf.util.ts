export class PDF{
    static base64ToBlob(base64: string, contentType: string = ''):Blob{
    try{
      if (base64.startsWith('data:')) {
        base64 = base64.split(',')[1];
      }
      const changeBlob = atob(base64)
      const size = new Array(changeBlob.length).fill(0).map((_, i) => changeBlob.charCodeAt(i))
      const byteArray = new Uint8Array(size)
      return new Blob([byteArray], {type: contentType})
    }catch(err){
      throw new Error('Chuỗi Base64 không hợp lệ.');
    }
  }
}