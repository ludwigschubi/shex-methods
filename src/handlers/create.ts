import { NamedNode, Statement, UpdateManager } from "rdflib";
import { QueryResult, Shape } from "../shape";

export interface CreateArgs<ShapeType> {
  doc: string;
  data: ShapeType & { id: string };
}

export async function create<ShapeType>(
  shape: Shape<ShapeType>,
  { doc, data }: CreateArgs<ShapeType>
): Promise<QueryResult<ShapeType>> {
  return new Promise(async (resolve, reject) => {
    let doesntExist = "";
    await shape.fetcher.load(doc).catch((err) => (doesntExist = err));
    const { id } = data as { id: string };
    if (shape.store.holds(new NamedNode(id), null, null, doc)) {
      throw new Error("Shape already exists doc " + doc);
    }
    const [_del, ins] = await shape.dataToStatements(data, doc);
    if (!doesntExist) {
      await updateExisting(shape.updater, [], ins).catch((err) => reject(err));
    } else {
      await createNew(shape.updater, doc, ins).catch((err) => reject(err));
    }
    const newlyCreated = (await shape.findOne({
      from: doc,
      where: { id },
    }).catch(reject)) as QueryResult<ShapeType>;
    resolve(newlyCreated);
  });
}

export function updateExisting(
  updater: UpdateManager,
  del: Statement[],
  ins: Statement[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    updater.update(del, ins, async (_uri, ok, error) => {
      !ok ? reject(error) : resolve();
    });
  });
}

function createNew(
  updater: UpdateManager,
  doc: string,
  ins: Statement[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    updater.put(
      new NamedNode(doc),
      ins,
      "text/turtle",
      async (_uri, ok, error) => {
        !ok ? reject(error) : resolve();
      }
    );
  });
}
