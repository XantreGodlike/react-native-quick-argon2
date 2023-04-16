//
// Created by Szymon on 24/02/2022.
//

#include "RNA2ThreadAwareHostObject.h"

#include <utility>

namespace rnargon2 {

namespace jsi = facebook::jsi;

void RNA2ThreadAwareHostObject::runOnWorkerThread(std::function<void()> &&job) {
  this->dispatchQueue->dispatch(job);
}

void RNA2ThreadAwareHostObject::runOnJSThread(std::function<void()> &&job) {
  auto callInvoker = this->weakJsCallInvoker.lock();
  if (callInvoker != nullptr) {
    callInvoker->invokeAsync(std::move(job));
  }
}

}  // namespace rnargon2
