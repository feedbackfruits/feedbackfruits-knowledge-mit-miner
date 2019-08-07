export declare const seasonMap: {
    "Spring": string;
    "Summer": string;
    "Fall": string;
    "Winter": string;
};
export declare function fileToDoc(fileInfo: any, courseInfo: any, coursePageIndex: any): {
    "@id": string;
    "@type": string[];
    name: any;
    description: any;
    keywords: any;
    license: string;
    learningResourceType: any;
    inLanguage: any;
    dateCreated: string;
    educationalLevel: any;
    sourceOrganization: string[];
    topic: string;
};
export declare function videoToDoc(mediaInfo: any, captions: any, captionsUrl: any, courseInfo: any, coursePageIndex: any): {
    caption: any[];
    contentDuration: any;
    contentLength: any;
    "@id": string;
    "@type": string[];
    name: any;
    keywords: any;
    learningResourceType: any;
    inLanguage: any;
    dateCreated: string;
    educationalLevel: any;
    license: string;
    sourceOrganization: string[];
    topic: string;
} | {
    "@id": string;
    "@type": string[];
    name: any;
    keywords: any;
    learningResourceType: any;
    inLanguage: any;
    dateCreated: string;
    educationalLevel: any;
    license: string;
    sourceOrganization: string[];
    topic: string;
};
