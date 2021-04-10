import { QueryResult, Shape } from "../shape";
import { validateShapes } from "../validate";

export interface FindAllArgs<ShapeType> {
  from: string | string[];
  where?: { id?: string[] } & Partial<Omit<ShapeType, "id">>;
}

export async function findAll<ShapeType>(
  shape: Shape<ShapeType>,
  { where, from }: FindAllArgs<ShapeType>
): Promise<QueryResult<ShapeType[]>> {
  let ids = where?.id;
  await shape.fetcher.load(from);
  const [data, errors] = await validateShapes<ShapeType>(shape, ids)
  return {
    from,
    data,
    errors,
  } as QueryResult<ShapeType[]>;
}
