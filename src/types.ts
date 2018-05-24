

export type Department = {
  id: string,
  title: string,
  image: string,
  url: string,
};

export type Course = {
  id: string,

  title: string,
  description: string, // Note: description may contain HTML
  image: string,
  url: string,
  department_url: string,

  level: string, // i.e. Graduate, Undergraduate, Post-Graduate, etc
  master_course_number: string,
  faculty: string[],
  year: string,
  term: string,

  course_topics: Object[],

  course_section_and_tlp_urls: string[],
  media_resources: Object[],

  // TODO: Figure out what to do with https://ocw.mit.edu/courses/physics/8-03sc-physics-iii-vibrations-and-waves-fall-2016
  pdf_list: {
    [index: string]: string[]
    // assignments?: string[],
    // readings?: string[],
    // 'lecture-slides'?: string[],
    // exams?: string[],
    // 'study-materials'?: string[],
    // recitations?: string[],
    // 'readings-notes-slides'?: string[],
    // labs?: string[],
    // syllabus?: string[],
    // projects?: string[],
    // 'problem-solving'?: string[],
    // 'class-activities'?: string[],
    // experiments?: string[]
    // 'related-resources'?: string[]
  }
};

export type VideoResource = {
  name: string
  path: string
  youtube_id: string
};

export type PDFType = 'assignments' | 'readings' | 'lecture-slides' | 'exams' | 'study-materials' | 'recitations' | 'readings-notes-slides' | 'labs' | 'syllabus' | 'projects' | 'problem-solving' | 'class-activities' |' experiments' | 'related-resources';
export type PDFResource = {
  url: string,
  type?: PDFType
}
