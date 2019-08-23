export interface ILostEntry {
  id: number;
  latitude: number;
  longitude: number;
  messageId: number;
  modMessageId?: number;
  peopleOnCase: Array<{ id: number, name: string }>;
  votebanCount: number;
};

export class LostEntry implements ILostEntry {
  private static entries: { [id: number]: ILostEntry } = {};

  public id: number;
  public latitude: number;
  public longitude: number;
  public messageId: number;
  public peopleOnCase: Array<{ id: number, name: string }>;
  public votebanCount: number;

  constructor(entry: ILostEntry) {
    Object.assign(this, entry);
  }

  public static create(entry: Partial<ILostEntry>) {
    let e: ILostEntry = LostEntry.entries[entry.id];

    if (e) {
      e.latitude = entry.latitude;
      e.longitude = entry.longitude;
      e.messageId = entry.messageId;
    } else {
      e = Object.assign({ peopleOnCase: [], votebanCount: 0 }, entry) as ILostEntry;
    }

    return e;
  }
}