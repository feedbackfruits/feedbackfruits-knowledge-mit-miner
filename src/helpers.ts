import fetch from './fetch';
import { Doc, Captions } from 'feedbackfruits-knowledge-engine';
import * as Types from './types';

export function departmentToDoc(department: Types.Department, children: string[]): Doc {
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

export function courseToDoc(course: Types.Course, children: string[]): Doc {
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


export async function getCaptionsForVideo(video: Types.VideoResource): Promise<Captions.Caption[]> {
  const { path, youtube_id } = video;
  const url = `https://ocw.mit.edu/${path}/${youtube_id}.srt`;
  const captions = await Captions.getCaptions(url);

  return captions;
}

export async function videoToResource(video: Types.VideoResource, course: Types.Course): Promise<Doc> {
  const { name, path, youtube_id } = video;
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtube_id}`;
  const topicUrl = `https://ocw.mit.edu/${path}`;
  const captions = await getCaptionsForVideo(video);
  const metadata = Captions.toMetadata(captions);


  const videoDoc = {
    "@id": youtubeUrl,
    "@type": [
      "Resource",
      "Video"
    ],
    name,
    sourceOrganization: [
      "https://ocw.mit.edu"
    ],
    topic: [
      topicUrl
    ],
    caption: captions,
    contentDuration: metadata.totalDuration,
    contentLength: metadata.totalLength,
  };

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

const typeNames = {
  'assignments': 'Assignment',
  'readings': 'Reading',
  'lecture-notes': 'Lecture notes',
  'lecture-slides': 'Lecture slides',
  'exams': 'Exam',
  'study-materials': 'Study materials',
  'recitations': 'Recitations',
  'readings-notes-slides': 'Reading-notes slides',
  'labs': 'Labs',
  'syllabus': 'Syllabus',
  'projects': 'Project',
  'problem-solving': 'Problem solving',
  'class-activities': 'Class activity',
  'experiments': 'Experiment',
  'related-resources': 'Related resource',
}
// Course is passed here to fill out the name and description with something useful
export function pdfToResource(pdf: Types.PDFResource, course: Types.Course): Doc {
  const { url, type } = pdf;
  const regex = /(.*)\/(.*)\.pdf/;
  const [ , topicUrl, pdfName ] = url.match(regex);

  // Do some type specific things here to fill out the name and description
  let name, description;
  if (type in typeNames) {
    console.log('Filling in name and description for:', pdf);
    const typeName = typeNames[type];
    name = `${course.title} | ${typeName}: ${pdfName}`;
    description = `Part of the learning material of ${course.level} level course ${course.title}.`
  } else {
    console.log('Unknown type:', pdf);
  }

  // Media annotator will fill out info about pages and preview image

  return {
    "@id": url,
    "@type": [
      "Resource",
      "Document"
    ],
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    sourceOrganization: [
      "https://ocw.mit.edu"
    ],
    topic: [
      topicUrl
    ]
  }
}
