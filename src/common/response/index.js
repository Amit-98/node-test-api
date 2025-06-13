class Response {

  constructor(build) {
    this.s = build.s
    this.m = build.m
    this.c = build.c
    this.r = build.r
    this.error=build.error
    this.errorMessage=build.errorMessage
    this.tr=build.tr
    this.page= build.page
    this.pages = build.pages
  }
}


class Builder {
    constructor(s) {
      this.s = s
    }

  setPagination(tr,page,pages,c)
  {
    this.tr=tr
    this.page= page
    this.pages = pages
    this.c = c
    return this
  }

  setMessage(m) {
    this.m = m
    return this
  }

  setResultData(r) {
    this.r = r
    return this
  }

  setErrorData(error) {
    this.error = error
    return this
  }

  setErrorMessage(message)
  {
    this.errorMessage=message
    return this
  }

  build() {
    return new Response(this)
  }
}

export default Builder
