export interface IData {
    name: string | null,
    yearOfBirth: number | null,
    gender: string | null,
    identifierId: string | null,
    phoneNumber: string | null,
    zalo: string | null,
    email: string | null,
    ethnicGroup: string | null,
    religion: string | null,
    professionalLevel: string | null,
    maritalStatus: number | null,
    contactPerson: string | null,
    contactPersonPhone: string | null,
    officeId: string | null,
    staffRelation: string | null,
    permanentAddress: string | null,
    temporaryAddress: string | null,
    contractType: string | null,
    fromDate: string | null,
    toDate: string | null,
    // contractDate: string | null,
    // signDate: string | null,
    // fileContract: string | null,
    // isLimitedTime: number | null,
    branchId: number | null,
    departmentId: string | null,
    positionId: string | null,
    routeId: string | null,
    businessCardNumber: string | null,
    bcStartDate: string| null,
    bcEndDate: string | null,
    bcImage: string | null,
    healthCertificate: string | null,
    hcEndDate: string | null,
    driverLicenseNumber: string | null,
    contractDuration: string| null,
    driverLicenseType: string | null,
    dlStartDate: string | null,
    dlEndDate: string | null,
    dlImage: string | null,
    contractFile: string | null,
    archivedRecordFiles: [],
    // archivedRecordFiles: string | null,
    lstChildren:[
        {
            name: string | null,
            yearOfBirth: string | null,
            gender : string | null
        }
    ],
    lstArchivedRecords: [
        {
            name: string| null,
            code: string | null,
            type: string| null,
            file: string | null
        }
    ],
    contract: {
        id: string | null,
        type: number | null,
        signDate:string | null
    }
}