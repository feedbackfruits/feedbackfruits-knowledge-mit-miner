import { Doc } from 'feedbackfruits-knowledge-engine';
import * as Types from './types';

export function departmentToDoc(department: Types.Department, courses: Types.Course[]): Doc {
  const children = courses.map(course => courseToDoc(course));
  return {
    "@id": department.url,
    "@type": [
      "Topic"
    ],
    name: department.title,
    image: department.image,
    child: children
  }
}

export function courseToDoc(course: Types.Course): Doc {
  const videos: Types.VideoResource[] = course.media_resources.map((media_resource) => {
    const [ name ] = Object.keys(media_resource);
    const { path, YouTube: { youtube_id } } = media_resource[name];
    return {
      name,
      path,
      youtube_id
    };
  });

  const pdfs: Types.PDFResource[] = Object.entries(course.pdf_list).reduce((memo, [ key, list ]) => {
    const pdfs = list.map(url => ({ url }));
    return [ ...memo, ...pdfs ];
  }, []);

  const children = [ ...pdfs.map(pdf => pdfToResource(pdf, course)), ...videos.map(video => videoToResource(video, course)) ]

  return {
    "@id": course.url,
    "@type": [
      "Topic",
      "Resource"
    ],
    name: course.title,
    description: course.description,
    parent: course.department_url,
    child: children
  }
}

export function videoToResource(video: Types.VideoResource, course: Types.Course): Doc {
  const { name, path, youtube_id } = video;
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtube_id}`;
  const videoDoc = {
    "@id": youtubeUrl,
    "@type": [
      "Resource",
      "Video"
    ],
    name
  };

  const topicUrl = `https://ocw.mit.edu/${path}`;
  const topicDoc = {
    "@id": topicUrl,
    "@type": [
      "Topic"
    ],
    child: [ videoDoc ],
    name
  };

  return topicDoc;
}

// Course is passed here to fill out the name and description with something useful
export function pdfToResource(pdf: Types.PDFResource, course: Types.Course): Doc {
  const { url } = pdf;

  // Do some type specific things here to fill out the name and description

  // Media annotator will fill out info about pages and preview image

  return {
    "@id": url,
    "@type": [
      "Resource",
      "Document"
    ]
  }
}
