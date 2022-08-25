import Incident, { IncidentModel } from '../model/Incident';
import { Types } from 'mongoose';
import User from '../model/User';

export default class IncidentRepo {
  private static AUTHOR_DETAIL = 'name profilePicUrl';
  private static BLOG_INFO_ADDITIONAL = '+isSubmitted +isDraft +isPublished +createdBy +updatedBy';
  private static Incindent_ALL_DATA =
    '+isDraft  +status +createdBy +updatedBy';

  public static async create(incident: Incident): Promise<Incident> {
    const now = new Date();
    incident.createdAt = now;
    incident.updatedAt = now;
    incident.status=false;
    incident.isDraft=false;
    const createdIncident = await IncidentModel.create(incident);
    return createdIncident;
  }

  public static update(incident: Incident): Promise<any> {
    incident.updatedAt = new Date();
    return IncidentModel.updateOne({ _id: incident._id }, { $set: { ...incident } })
      .lean<Incident>()
      .exec();
  }

  public static findInfoById(id: Types.ObjectId): Promise<Incident | null> {
    return IncidentModel.findOne({ _id: id })
    .select('+status +createdAt +updatedAt')
      .populate('author', this.AUTHOR_DETAIL)
      .populate('asignTo',this.AUTHOR_DETAIL)
      .lean<Incident>()
      .exec();
  }

  public static findInfoByTitle(title:string): Promise<Incident | null> {
    return IncidentModel.findOne({ title: title })
      .populate('author', this.AUTHOR_DETAIL)
      .populate('asignTo',this.AUTHOR_DETAIL)
      .lean<Incident>()
      .exec();
  }


  public static findIncidentAllDataById(id: Types.ObjectId): Promise<Incident | null> {
    return IncidentModel.findOne({ _id: id })
      .select(this.Incindent_ALL_DATA)
      .populate('author', this.AUTHOR_DETAIL)
      .populate('asignTo',this.AUTHOR_DETAIL)
      .lean<Incident>()
      .exec();
  }






  public static findAllPublishedForAuthor(user: User): Promise<Incident[]> {
    return IncidentModel.find({ author: user, status: true, isPublished: true })
      .populate('author', this.AUTHOR_DETAIL)
      .populate('asignTo',this.AUTHOR_DETAIL)
      .sort({ updatedAt: -1 })
      .lean<Incident[]>()
      .exec();
  }


  public static findLatestIncidents(pageNumber: number, limit: number,id): Promise<Incident[]> {
    return IncidentModel.find({author:id})
      .select('+status +createdAt +updatedAt')
      .skip(limit * (pageNumber - 1))
      .limit(limit)
      .populate('author', this.AUTHOR_DETAIL)
      .populate('asignTo',this.AUTHOR_DETAIL)
      .sort({ publishedAt: -1 })
      .lean<Incident[]>()
      .exec();
  }

  public static findLatestIncidentsforEditor(pageNumber: number, limit: number,id): Promise<Incident[]> {
    return IncidentModel.find({asignTo:id})
      .select('+status +createdAt +updatedAt')
      .skip(limit * (pageNumber - 1))
      .limit(limit)
      .populate('author', this.AUTHOR_DETAIL)
      .populate('asignTo',this.AUTHOR_DETAIL)
      .sort({ publishedAt: -1 })
      .lean<Incident[]>()
      .exec();
  }
  public static findAllDraftsIncidents(pageNumber: number, limit: number,ID): Promise<Incident[]> {
    return IncidentModel.find({ isDraft:true,author:ID})
      .skip(limit * (pageNumber - 1))
      .limit(limit)
      .populate('author', this.AUTHOR_DETAIL)
      .populate('asignTo',this.AUTHOR_DETAIL)
      .sort({ publishedAt: -1 })
      .lean<Incident[]>()
      .exec();
  }

  public static searchSimilarIncidents(blog: Incident, limit: number): Promise<Incident[]> {
    return IncidentModel.find(
      {
        $text: { $search: blog.title, $caseSensitive: false },
        _id: { $ne: blog._id },
      },
      {
        similarity: { $meta: 'textScore' },
      },
    )
      .populate('author', this.AUTHOR_DETAIL)
      .populate('asignTo',this.AUTHOR_DETAIL)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .sort({ similarity: { $meta: 'textScore' } })
      .lean<Incident[]>()
      .exec();
  }

  public static search(query: string, limit: number): Promise<Incident[]> {
    console.log(query)
    return IncidentModel.find(
      {
        $text: { $search: query, $caseSensitive: false }
      },
      {
        similarity: { $meta: 'textScore' },
      },
    )
      .select('+status +description')
      .limit(limit)
      .sort({ similarity: { $meta: 'textScore' } })
      .lean<Incident[]>()
      .exec();
  }


}
