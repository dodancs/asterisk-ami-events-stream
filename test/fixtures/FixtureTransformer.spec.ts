/**
 * Developer: BelirafoN
 * Date: 22.04.2016
 * Time: 16:37
 */

import { Transform, TransformCallback } from "stream";

export default class FixtureTransformer extends Transform {
    constructor() {
        super();
    }

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
        this.push(chunk.toString('utf-8').replace(/\n/g, '\r\n'));
        callback();
    }
}
