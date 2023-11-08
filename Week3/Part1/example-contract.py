import beaker
import pyteal as pt

class AppState:
    counter_global = beaker.GlobalStateValue(
        stack_type=pt.TealType.uint64,
        default=pt.Int(0)
    )

app = beaker.Application("simple_counter", state=AppState())

@app.external
def increment_global(*, output: pt.abi.Uint64) -> pt.Expr:
    return pt.Seq(
        app.state.counter_global.set(app.state.counter_global.get() + pt.Int(1)),
        output.set(app.state.counter_global.get())
    )

@app.external
def decrement_global(*, output: pt.abi.Uint64) -> pt.Expr:
    return pt.Seq(
        app.state.counter_global.set(app.state.counter_global.get() - pt.Int(1)),
        output.set(app.state.counter_global.get())
    )

