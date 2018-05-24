export declare type Department = {
    id: string;
    title: string;
    image: string;
    url: string;
};
export declare type Course = {
    id: string;
    title: string;
    description: string;
    image: string;
    url: string;
    department_url: string;
    level: string;
    master_course_number: string;
    faculty: string[];
    year: string;
    term: string;
    course_topics: Object[];
    course_section_and_tlp_urls: string[];
    media_resources: Object[];
    pdf_list: {
        [index: string]: string[];
    };
};
export declare type VideoResource = {
    name: string;
    path: string;
    youtube_id: string;
};
export declare type PDFType = 'assignments' | 'readings' | 'lecture-slides' | 'exams' | 'study-materials' | 'recitations' | 'readings-notes-slides' | 'labs' | 'syllabus' | 'projects' | 'problem-solving' | 'class-activities' | ' experiments' | 'related-resources';
export declare type PDFResource = {
    url: string;
    type?: PDFType;
};
