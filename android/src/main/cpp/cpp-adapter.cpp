#include <ReactCommon/CallInvokerHolder.h>
#include <fbjni/fbjni.h>
#include <jni.h>
#include <jsi/jsi.h>

#include "RNA2QuickArgon2HostObject.h"

using namespace facebook;

class Argon2CppAdapter : public jni::HybridClass<Argon2CppAdapter> {
   public:
    static auto constexpr kJavaDescriptor =
        "Lcom/quickargon2/QuickArgon2Module;";

    static jni::local_ref<jni::HybridClass<Argon2CppAdapter>::jhybriddata>
    initHybrid(jni::alias_ref<jhybridobject> jThis) {
        return makeCxxInstance();
    }

    Argon2CppAdapter() {}

    void install(jsi::Runtime &runtime,
                 std::shared_ptr<facebook::react::CallInvoker> jsCallInvoker) {
        auto workerQueue =
            std::make_shared<rnargon2::DispatchQueue::dispatch_queue>(
                "argon2 worker thread");
        auto hostObject = std::make_shared<rnargon2::RNA2QuickArgon2HostObject>(
            jsCallInvoker, workerQueue);
        auto object = jsi::Object::createFromHostObject(runtime, hostObject);
        runtime.global().setProperty(runtime, "__QuickArgon2Proxy",
                                     std::move(object));
    }

    void nativeInstall(
        jlong jsiPtr,
        jni::alias_ref<facebook::react::CallInvokerHolder::javaobject>
            jsCallInvokerHolder) {
        auto jsCallInvoker = jsCallInvokerHolder->cthis()->getCallInvoker();
        auto runtime = reinterpret_cast<jsi::Runtime *>(jsiPtr);
        if (runtime) {
            install(*runtime, jsCallInvoker);
        }
        // if runtime was nullptr, QuickArgon2 will not be installed. This
        // should only happen while Remote Debugging (Chrome), but will be weird
        // either way.
    }

    static void registerNatives() {
        registerHybrid(
            {makeNativeMethod("initHybrid", Argon2CppAdapter::initHybrid),
             makeNativeMethod("nativeInstall",
                              Argon2CppAdapter::nativeInstall)});
    }

   private:
    friend HybridBase;
};

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
    return facebook::jni::initialize(
        vm, [] { Argon2CppAdapter::registerNatives(); });
}
